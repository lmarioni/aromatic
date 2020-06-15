
const calendarLabel = "Calendario";
const roleDescription = "Selector de fechas";
const closeDatePicker = "Cerca";
const focusStartDate = "Interactúa con el calendario y agrega la fecha de check-in para tu viaje";
const clearDate = "Borrar fecha";
const clearDates = "Borrar fechas";
const jumpToPrevMonth = "Retroceder para cambiar al mes anterior";
const jumpToNextMonth = "Avanzar para cambiar al próximo mes";
const keyboardShortcuts = "Atajos de teclado";
const showKeyboardShortcutsPanel = "Abra el panel de atajos de teclado";
const hideKeyboardShortcutsPanel = "Cerrar el panel de accesos directos";
const openThisPanel = "Abrir este panel";
const enterKey = "Introducir clave";
const leftArrowRightArrow = "Teclas de flecha derecha e izquierda";
const upArrowDownArrow = "teclas de flecha arriba y abajo";
const pageUpPageDown = "teclas de página arriba y página abajo";
const homeEnd = "Teclas de inicio y fin";
const escape = "Tecla de escape";
const questionMark = "Signo de interrogación";
const selectFocusedDate = "Seleccione la fecha en foco";
const moveFocusByOneDay = "Avanzar (izquierda) y avanzar (derecha) un día";
const moveFocusByOneWeek = "Avanzar (hacia arriba) y hacia adelante (hacia abajo) una semana";
const moveFocusByOneMonth = "Cambiar meses";
const moveFocustoStartAndEndOfWeek = "Ir al primer o último día de una semana";
const returnFocusToInput = "Volver al campo de entrada de fecha.";
const keyboardForwardNavigationInstructions = "Navegue hacia adelante para interactuar con el calendario y seleccione una fecha. Presione la tecla de signo de interrogación para obtener los atajos de teclado para cambiar las fechas. ";
const keyboardBackwardNavigationInstructions = "Navegue hacia atrás para interactuar con el calendario y seleccione una fecha. Presione la tecla de signo de interrogación para obtener los atajos de teclado para cambiar las fechas. ";

const chooseAvailableStartDate = ({ date }) => `Elija ${date} como su fecha de registro. Está disponible `;
const chooseAvailableEndDate = ({ date }) =>   `Elija ${date} como fecha de salida. Está disponible `;
const chooseAvailableDate = ({ date }) =>   date;
const dateIsUnavailable = ({ date }) =>   `No disponible. ${date} `;
const dateIsSelected = ({ date }) =>   `Seleccionado. ${date} `;
const dateIsSelectedAsStartDate = ({ date }) =>   `Seleccionado como fecha de inicio. ${date} `;
const dateIsSelectedAsEndDate = ({ date }) =>   `Seleccionado como fecha de finalización. ${date} `;

export default {
  calendarLabel,
  roleDescription,
  closeDatePicker,
  focusStartDate,
  clearDate,
  clearDates,
  jumpToPrevMonth,
  jumpToNextMonth,
  keyboardShortcuts,
  showKeyboardShortcutsPanel,
  hideKeyboardShortcutsPanel,
  openThisPanel,
  enterKey,
  leftArrowRightArrow,
  upArrowDownArrow,
  pageUpPageDown,
  homeEnd,
  escape,
  questionMark,
  selectFocusedDate,
  moveFocusByOneDay,
  moveFocusByOneWeek,
  moveFocusByOneMonth,
  moveFocustoStartAndEndOfWeek,
  returnFocusToInput,
  keyboardForwardNavigationInstructions,
  keyboardBackwardNavigationInstructions,

  chooseAvailableStartDate,
  chooseAvailableEndDate,
  dateIsUnavailable,
  dateIsSelected,
  dateIsSelectedAsStartDate,
  dateIsSelectedAsEndDate,
};

export const DateRangePickerPhrases = {
  calendarLabel,
  roleDescription,
  closeDatePicker,
  clearDates,
  focusStartDate,
  jumpToPrevMonth,
  jumpToNextMonth,
  keyboardShortcuts,
  showKeyboardShortcutsPanel,
  hideKeyboardShortcutsPanel,
  openThisPanel,
  enterKey,
  leftArrowRightArrow,
  upArrowDownArrow,
  pageUpPageDown,
  homeEnd,
  escape,
  questionMark,
  selectFocusedDate,
  moveFocusByOneDay,
  moveFocusByOneWeek,
  moveFocusByOneMonth,
  moveFocustoStartAndEndOfWeek,
  returnFocusToInput,
  keyboardForwardNavigationInstructions,
  keyboardBackwardNavigationInstructions,
  chooseAvailableStartDate,
  chooseAvailableEndDate,
  dateIsUnavailable,
  dateIsSelected,
  dateIsSelectedAsStartDate,
  dateIsSelectedAsEndDate,
};

export const DateRangePickerInputPhrases = {
  focusStartDate,
  clearDates,
  keyboardForwardNavigationInstructions,
  keyboardBackwardNavigationInstructions,
};

export const SingleDatePickerPhrases = {
  calendarLabel,
  roleDescription,
  closeDatePicker,
  clearDate,
  jumpToPrevMonth,
  jumpToNextMonth,
  keyboardShortcuts,
  showKeyboardShortcutsPanel,
  hideKeyboardShortcutsPanel,
  openThisPanel,
  enterKey,
  leftArrowRightArrow,
  upArrowDownArrow,
  pageUpPageDown,
  homeEnd,
  escape,
  questionMark,
  selectFocusedDate,
  moveFocusByOneDay,
  moveFocusByOneWeek,
  moveFocusByOneMonth,
  moveFocustoStartAndEndOfWeek,
  returnFocusToInput,
  keyboardForwardNavigationInstructions,
  keyboardBackwardNavigationInstructions,
  chooseAvailableDate,
  dateIsUnavailable,
  dateIsSelected,
};

export const SingleDatePickerInputPhrases = {
  clearDate,
  keyboardForwardNavigationInstructions,
  keyboardBackwardNavigationInstructions,
};

export const DayPickerPhrases = {
  calendarLabel,
  roleDescription,
  jumpToPrevMonth,
  jumpToNextMonth,
  keyboardShortcuts,
  showKeyboardShortcutsPanel,
  hideKeyboardShortcutsPanel,
  openThisPanel,
  enterKey,
  leftArrowRightArrow,
  upArrowDownArrow,
  pageUpPageDown,
  homeEnd,
  escape,
  questionMark,
  selectFocusedDate,
  moveFocusByOneDay,
  moveFocusByOneWeek,
  moveFocusByOneMonth,
  moveFocustoStartAndEndOfWeek,
  returnFocusToInput,
  chooseAvailableStartDate,
  chooseAvailableEndDate,
  chooseAvailableDate,
  dateIsUnavailable,
  dateIsSelected,
  dateIsSelectedAsStartDate,
  dateIsSelectedAsEndDate,
};

export const DayPickerKeyboardShortcutsPhrases = {
  keyboardShortcuts,
  showKeyboardShortcutsPanel,
  hideKeyboardShortcutsPanel,
  openThisPanel,
  enterKey,
  leftArrowRightArrow,
  upArrowDownArrow,
  pageUpPageDown,
  homeEnd,
  escape,
  questionMark,
  selectFocusedDate,
  moveFocusByOneDay,
  moveFocusByOneWeek,
  moveFocusByOneMonth,
  moveFocustoStartAndEndOfWeek,
  returnFocusToInput,
};

export const DayPickerNavigationPhrases = {
  jumpToPrevMonth,
  jumpToNextMonth,
};

export const CalendarDayPhrases = {
  chooseAvailableDate,
  dateIsUnavailable,
  dateIsSelected,
  dateIsSelectedAsStartDate,
  dateIsSelectedAsEndDate,
};