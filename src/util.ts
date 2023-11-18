export function findInvalidControls(formControl: any) {
  const invalid = [];
  const controls: any = formControl.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
  }
  return invalid;
}
