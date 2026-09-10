// Provisional values intentionally have no contact or payment action.
export const lar = {
  fixedPhone: "(14) 3372-1836", mobilePhone: "(14) 99999-9999",
  pix: "XXX.XXX.XXX-XX", email: "contato@exemplo.com", cnpj: "56.816.325/0001-00",
  instagram: "https://www.instagram.com/lar.fermino2018.magnani/",
  facebook: "https://www.facebook.com/pages/Lar-da-Crian%C3%A7a-Fermino-Magnani/111212248963868",
  transparency: "https://www.santacruzdoriopardo.sp.gov.br/terceiro-setor/detalhes/22/159",
  cortellaPost: "https://www.instagram.com/lar.fermino2018.magnani/reel/Da356sTpV5f/",
  trainingPost: "https://www.instagram.com/lar.fermino2018.magnani/reel/DbJBT7zOIPW/",
  junina2025: "https://www.instagram.com/stories/highlights/18131425075427754/",
  junina2024: "https://www.instagram.com/stories/highlights/17995835453487190/",
};
// Archive the announcement after its calendar date without asserting it occurred.
export function eventIsPast(now: Date) {
  return now.getTime() >= Date.parse("2026-09-12T00:00:00-03:00");
}
