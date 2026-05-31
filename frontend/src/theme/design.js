export const ui = {
  page: 'min-h-screen bg-canvas text-ink antialiased',

  pageCenter: 'flex min-h-screen flex-col justify-center bg-canvas px-6 py-10',

  card: 'rounded-lg border border-mute/70 bg-canvas-soft p-5 text-ink shadow-[0_1px_0_rgba(32,21,21,0.04)] md:p-6',

  title: 'text-2xl font-semibold leading-[30px] text-ink',

  subtitle: 'mt-1 text-base leading-6 text-body',

  label: 'mb-1.5 block text-sm font-medium leading-5 text-ink',

  field:
    'w-full rounded-md border border-mute bg-canvas px-3.5 py-2.5 text-base font-normal leading-6 text-ink placeholder:text-body-mid outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15',

  btnPrimary:
    'inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-semibold leading-6 text-on-primary transition-opacity hover:opacity-95 active:opacity-90 disabled:pointer-events-none disabled:opacity-40',

  btnSecondary:
    'inline-flex min-h-10 items-center justify-center rounded-md bg-ink px-4 py-2 text-base font-semibold leading-6 text-on-primary transition-opacity hover:opacity-95 active:opacity-90 disabled:opacity-40',

  btnTertiary:
    'inline-flex min-h-10 items-center justify-center rounded-md border border-mute bg-canvas px-4 py-2 text-base font-semibold leading-6 text-ink transition-colors hover:border-ink hover:bg-canvas-soft disabled:opacity-40',

  btnTertiaryCompact:
    'inline-flex items-center justify-center rounded-md border border-mute bg-canvas px-3 py-1.5 text-sm font-semibold leading-5 text-ink transition-colors hover:border-ink hover:bg-canvas-soft',

  btnText:
    'inline-flex items-center justify-center rounded-xl bg-canvas px-4 py-2 text-sm font-bold leading-none tracking-wide text-ink underline-offset-2 hover:underline',

  noticeError:
    'mt-4 rounded-md border border-primary/40 bg-canvas p-3 text-sm leading-6 text-ink',

  noticeSuccess:
    'mt-4 rounded-md border border-mute bg-canvas p-3 text-sm leading-6 text-ink',

  fileField:
    'w-full cursor-pointer rounded-md border border-mute bg-canvas px-3.5 py-2.5 text-base font-normal leading-6 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-on-primary',

  tableWrap: 'overflow-x-auto rounded-lg border border-mute bg-canvas',

  tableHeadRow:
    'border-b border-mute bg-canvas-soft text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-body',

  tableBodyRow: 'border-b border-mute/80 transition-colors last:border-b-0 hover:bg-canvas-soft/70',

  badge: 'inline-block rounded-md border border-mute bg-canvas px-2.5 py-1 text-sm font-medium leading-5 text-ink',

  eyebrow: 'text-xs font-semibold uppercase leading-none tracking-[0.12em] text-ink',
};
