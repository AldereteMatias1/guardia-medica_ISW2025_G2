
export const OBRA_SOCIAL_SERVICIO = "OBRA_SOCIAL_SERVICIO"

export interface IObraSocialServicio {
    traerTodaslasObrasSociales(): Promise<string[] | null>;
}