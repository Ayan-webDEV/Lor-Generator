# Exact PDF field mapping

All coordinates are in PDF points from the top-left reference system used during inspection (A4 595.2 × 841.92 pt). The service converts to pdf-lib's bottom-left drawing coordinates.

- Cover page fields are raster text in the original cover artwork, so the service covers only the Batch / Record and Record Date text areas and writes new text over them.
- Register pages contain selectable Poppins text. Only the four requested field regions per intern are covered and redrawn.
- Declaration date is replaced in the correct physical page for each template.
- 8-intern template continuation: physical page 4 carries intern records 6–8; physical page 5 carries the declaration date.

The original template files are copied unchanged into `server/templates`.
