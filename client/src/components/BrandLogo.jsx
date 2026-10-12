export function BrandLogo({ variant = 'horizontal', className = '' }) {
  const horizontal = variant === 'horizontal';
  return (
    <span className={`brand-logo ${horizontal ? 'brand-logo-horizontal' : 'brand-logo-symbol'} ${className}`}>
      {horizontal ? (
        <>
          <img className="brand-logo-on-dark" src="/logos/momentum-horizontal-light.svg" alt="Momentum" loading="eager" decoding="async" />
          <img className="brand-logo-on-light" src="/logos/momentum-horizontal-dark.svg" alt="Momentum" loading="eager" decoding="async" />
        </>
      ) : (
        <img src="/icons/momentum-symbol.svg" alt="Momentum app icon" loading="eager" decoding="async" />
      )}
    </span>
  );
}
