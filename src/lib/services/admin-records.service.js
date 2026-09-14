import { db } from '@/lib/db';
import { decryptPersonalData, maskIdentityNumber } from '@/lib/personal-data';

export async function getApplications() {
  const [rows] = await db.execute(`
    SELECT id, application_type, full_name, tc_identity_number, phone, email,
      settlement_type, settlement_name, university_name, department_name,
      request_detail, application_status, created_at, updated_at
    FROM applications
    ORDER BY created_at DESC
  `);
  return rows.map(({ tc_identity_number: encryptedIdentity, ...application }) => {
    let maskedIdentity = 'Gizli';
    try {
      maskedIdentity = maskIdentityNumber(decryptPersonalData(encryptedIdentity));
    } catch (error) {
      console.error('Başvuru kimlik bilgisi çözülemedi:', {
        applicationId: application.id,
        error,
      });
    }
    return { ...application, masked_identity_number: maskedIdentity };
  });
}

export async function updateApplicationStatus(id, status) {
  const [result] = await db.execute(
    'UPDATE applications SET application_status=? WHERE id=?',
    [status, id]
  );
  return result.affectedRows > 0;
}

export async function getDonations() {
  const [rows] = await db.execute(`
    SELECT d.id, d.donation_type, d.payment_period, d.amount,
      d.sender_name, d.transfer_date,
      d.dedication_name, d.is_anonymous, d.payment_status,
      d.payment_reference, d.created_at, c.name AS campaign_name
    FROM donations d
    LEFT JOIN campaigns c ON c.id=d.campaign_id
    ORDER BY d.created_at DESC
  `);
  return rows;
}

export async function getDonationCampaigns() {
  const [rows] = await db.execute('SELECT id,name,status FROM campaigns ORDER BY status="active" DESC,name');
  return rows;
}

export async function createDonation(data) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    if (data.campaignId) {
      const [campaigns] = await connection.execute('SELECT id FROM campaigns WHERE id=? FOR UPDATE', [data.campaignId]);
      if (!campaigns[0]) throw new Error('Seçilen kampanya bulunamadı.');
    }
    const [result] = await connection.execute(
      `INSERT INTO donations (
        campaign_id,donation_type,payment_period,amount,sender_name,transfer_date,
        dedication_name,is_anonymous,payment_status,payment_reference
      ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        data.campaignId || null, data.donationType, data.paymentPeriod, data.amount,
        data.senderName || null, data.transferDate || null, data.dedicationName || null,
        data.isAnonymous ? 1 : 0, data.paymentStatus, data.paymentReference || null,
      ]
    );
    if (data.campaignId) {
      await connection.execute(
        `UPDATE campaigns SET collected_amount=(SELECT COALESCE(SUM(amount),0) FROM donations WHERE campaign_id=? AND payment_status='paid') WHERE id=?`,
        [data.campaignId, data.campaignId]
      );
    }
    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateDonationStatus(id, status) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [donations] = await connection.execute(
      'SELECT campaign_id FROM donations WHERE id=? FOR UPDATE',
      [id]
    );
    const donation = donations[0];
    if (!donation) {
      await connection.rollback();
      return false;
    }

    await connection.execute(
      'UPDATE donations SET payment_status=? WHERE id=?',
      [status, id]
    );

    if (donation.campaign_id) {
      await connection.execute(
        `UPDATE campaigns
         SET collected_amount=(
           SELECT COALESCE(SUM(amount), 0)
           FROM donations
           WHERE campaign_id=? AND payment_status='paid'
         )
         WHERE id=?`,
        [donation.campaign_id, donation.campaign_id]
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getDashboardStats() {
  const [[applications], [donations], [news], [contact], [activities], [gallery]] = await Promise.all([
    db.execute(`SELECT COUNT(*) AS total,
      SUM(application_status='pending') AS pending FROM applications`),
    db.execute(`SELECT COUNT(*) AS total,
      SUM(payment_status='paid') AS paid_count,
      COALESCE(SUM(CASE WHEN payment_status='paid' THEN amount ELSE 0 END), 0) AS paid_amount
      FROM donations`),
    db.execute(`SELECT COUNT(*) AS total,
      SUM(status='published') AS published FROM news`),
    db.execute(`SELECT COUNT(*) AS total,
      SUM(status='new') AS new_count FROM contact_messages`),
    db.execute(`SELECT COUNT(*) AS total,
      SUM(status='published') AS published FROM activities`),
    db.execute(`SELECT COUNT(*) AS total,
      SUM(status='published') AS published FROM gallery_albums`),
  ]);

  return {
    applications: applications[0],
    donations: donations[0],
    news: news[0],
    contact: contact[0],
    activities: activities[0],
    gallery: gallery[0],
  };
}
