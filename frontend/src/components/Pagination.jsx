import { ui } from '../theme/design';

export function Pagination({ page, totalItems, perPage, onPageChange, onPerPageChange, perPageOptions = [5, 10, 15] }) {
  const totalPage = Math.ceil(totalItems / perPage);
  const startData = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endData = Math.min(page * perPage, totalItems);

  function movePage(nextPage) {
    if (nextPage < 1 || nextPage > totalPage) return;
    onPageChange(nextPage);
  }

  if (totalItems === 0 && !onPerPageChange) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm leading-6 text-body">
      <div className="flex flex-wrap items-center gap-4">
        <p className="m-0">
          Menampilkan {startData}-{endData} dari {totalItems} data
        </p>

        {onPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-body-mid">Tampilkan:</span>
            <select
              value={perPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                onPerPageChange(val);
              }}
              className="rounded-md border border-mute bg-canvas px-2.5 py-1 text-xs font-semibold text-ink outline-none cursor-pointer focus:border-primary"
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {totalPage > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => movePage(page - 1)}
            disabled={page === 1}
            className={ui.btnTertiaryCompact}
          >
            Sebelumnya
          </button>
          <span className={ui.badge}>
            Halaman {page} / {totalPage}
          </span>
          <button
            type="button"
            onClick={() => movePage(page + 1)}
            disabled={page === totalPage}
            className={ui.btnTertiaryCompact}
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
