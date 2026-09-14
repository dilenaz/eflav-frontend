import Link from 'next/link';

const variants = {
  primary:
    'bg-eflavBordo text-white hover:bg-eflavBordoKoyu focus-visible:ring-eflavBordo',
  secondary:
    'bg-eflavAltin text-eflavAntrasit hover:bg-eflavAltinAcik focus-visible:ring-eflavAltin',
  outline:
    'border border-eflavBordo bg-transparent text-eflavBordo hover:bg-eflavBordo hover:text-white focus-visible:ring-eflavBordo',
  ghost:
    'bg-transparent text-eflavBordo hover:bg-eflavKrem focus-visible:ring-eflavBordo',
  text:
    'rounded-none bg-transparent p-0 text-eflavBordo hover:text-eflavBordoKoyu focus-visible:ring-eflavBordo',
};

const sizes = {
  sm: 'min-h-10 px-4 py-2 text-sm',
  md: 'min-h-11 px-6 py-3 text-sm',
  lg: 'min-h-12 px-8 py-4 text-base',
  icon: 'h-12 w-12 p-0 text-lg',
};

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  const variantClasses = variants[variant] ?? variants.primary;
  const sizeClasses = sizes[size] ?? sizes.md;

  const classes = [
    'inline-flex shrink-0 items-center justify-center gap-2',
    'rounded-full font-bold',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses,
    sizeClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    const {
      target,
      rel,
      onClick,
      'aria-label': ariaLabel,
      ...linkProps
    } = props;

    const safeRel =
      target === '_blank' ? rel || 'noopener noreferrer' : rel;

    return (
      <Link
        href={href}
        className={classes}
        target={target}
        rel={safeRel}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
