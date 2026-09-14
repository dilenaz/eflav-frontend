export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'md',
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        rounded-[1.75rem]
        border
        border-eflavSinir
        bg-white
        shadow-[0_12px_40px_rgba(15,81,59,.06)]
        transition-all
        duration-300
        ${
          hover
            ? 'hover:-translate-y-1 hover:shadow-xl'
            : ''
        }
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
