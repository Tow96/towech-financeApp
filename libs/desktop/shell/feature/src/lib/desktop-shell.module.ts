// TODO: Eventually remove this
@NgModule({
  imports: [
    // Base
    CommonModule,
    // Http
    HttpClientModule,
    // NGRX
    DesktopShellDataAccessUserStateModule,
    // Guards
    DesktopShellUtilsGuardsModule,
  ],
})
export class DesktopShellModule {}
