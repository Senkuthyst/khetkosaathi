<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep mock agricultural observations behind src/lib/data; registration does not imply live data for that field.
- Store inspections in Cloud through device-capability RPCs; hashed random tokens scope private demo records without introducing account signup.
- Store incorrect-information reports as insert-only Cloud records; do not expose submitted reports publicly.
- Use shared DataCard metadata, report controls, charts, and threshold validation across feature routes to keep safety and measurement semantics consistent.
- Keep farm-map libraries in the lazy browser-only map module; use Geoman for vertex editing and Turf for area/intersection checks to avoid SSR failures and invalid GeoJSON.
