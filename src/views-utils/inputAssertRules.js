export default {
  notEmpty(e) { return ((e !== null) && (`${e}`.trim() !== '')) ? true : 'Поле должно быть заполнено' },
  length(from, to) { return e => ((e.length >= from) && (e.length <= to)) ? true : 'Неправильная длина' },
  email(e) { return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(e) ? true : 'Неправильный Email' },
  notNegative(e) { return parseInt(e) >= 0 ? true : "Должно быть больше нуля" }
}