import styled from 'styled-components';

export const ReactDatePickerStyle = styled.div`
  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle,
  .react-datepicker-popper[data-placement^='top'] .react-datepicker__triangle,
  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow,
  .react-datepicker__month-year-read-view--down-arrow {
    margin-left: -8px;
    position: absolute;
  }

  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle,
  .react-datepicker-popper[data-placement^='top'] .react-datepicker__triangle,
  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow,
  .react-datepicker__month-year-read-view--down-arrow,
  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^='top']
    .react-datepicker__triangle::before,
  .react-datepicker__year-read-view--down-arrow::before,
  .react-datepicker__month-read-view--down-arrow::before,
  .react-datepicker__month-year-read-view--down-arrow::before {
    box-sizing: content-box;
    position: absolute;
    border: 8px solid transparent;
    height: 0;
    width: 1px;
  }

  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^='top']
    .react-datepicker__triangle::before,
  .react-datepicker__year-read-view--down-arrow::before,
  .react-datepicker__month-read-view--down-arrow::before,
  .react-datepicker__month-year-read-view--down-arrow::before {
    content: '';
    z-index: -1;
    border-width: 8px;
    left: -8px;
  }

  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle {
    top: 0;
    margin-top: -8px;
  }

  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle,
  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle::before {
    border-top: none;
    border-bottom-color: ${props => props.theme.color.subtle};
  }

  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle::before {
    top: -1px;
  }

  .react-datepicker-popper[data-placement^='top'] .react-datepicker__triangle,
  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow,
  .react-datepicker__month-year-read-view--down-arrow {
    bottom: 0;
    margin-bottom: -8px;
  }

  .react-datepicker-popper[data-placement^='top'] .react-datepicker__triangle,
  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow,
  .react-datepicker__month-year-read-view--down-arrow,
  .react-datepicker-popper[data-placement^='top']
    .react-datepicker__triangle::before,
  .react-datepicker__year-read-view--down-arrow::before,
  .react-datepicker__month-read-view--down-arrow::before,
  .react-datepicker__month-year-read-view--down-arrow::before {
    border-bottom: none;
    border-top-color: #fff;
  }

  .react-datepicker-popper[data-placement^='top']
    .react-datepicker__triangle::before,
  .react-datepicker__year-read-view--down-arrow::before,
  .react-datepicker__month-read-view--down-arrow::before,
  .react-datepicker__month-year-read-view--down-arrow::before {
    bottom: -1px;
  }

  .react-datepicker-wrapper {
    display: inline-block;
    padding: 0;
    border: 0;
  }

  .react-datepicker {
    font-family: inherit;
    font-weight: ${props => props.theme.weight.light};
    font-size: 0.8rem;
    color: ${props => props.theme.color.primary};
    background-color: #fff;
    border-radius: 0.3rem;
    display: inline-block;
    position: relative;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  }

  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  .react-datepicker__input-container > [value] {
    flex: 1;
    display: flex;
  }

  .react-datepicker__triangle {
    position: absolute;
    left: 50px;
  }

  .react-datepicker-popper {
    z-index: 1;
  }

  .react-datepicker-popper[data-placement^='bottom'] {
    margin-top: 10px;
  }

  .react-datepicker-popper[data-placement='bottom-end']
    .react-datepicker__triangle,
  .react-datepicker-popper[data-placement='top-end']
    .react-datepicker__triangle {
    left: auto;
    right: 50px;
  }

  .react-datepicker-popper[data-placement^='top'] {
    margin-bottom: 10px;
  }

  .react-datepicker-popper[data-placement^='right'] {
    margin-left: 8px;
  }

  .react-datepicker-popper[data-placement^='right']
    .react-datepicker__triangle {
    left: auto;
    right: 42px;
  }

  .react-datepicker-popper[data-placement^='left'] {
    margin-right: 8px;
  }

  .react-datepicker-popper[data-placement^='left'] .react-datepicker__triangle {
    left: 42px;
    right: auto;
  }

  .react-datepicker__header {
    text-align: center;
    background-color: ${props => props.theme.color.subtle};
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    padding-top: 8px;
    position: relative;
  }

  .react-datepicker__current-month,
  .react-datepicker-year-header {
    margin-top: 0;
    font-weight: ${props => props.theme.weight.medium};
    font-size: 0.944rem;
  }

  .react-datepicker__navigation {
    background: none;
    line-height: 1.7rem;
    text-align: center;
    cursor: pointer;
    position: absolute;
    top: 10px;
    width: 0;
    padding: 0;
    border: 0.45rem solid transparent;
    z-index: 1;
    height: 10px;
    width: 10px;
    text-indent: -999em;
    overflow: hidden;
    outline: none;
  }

  .react-datepicker__navigation--previous {
    left: 10px;
    border-right-color: ${props => props.theme.color.text};
  }

  .react-datepicker__navigation--previous:hover {
    border-right-color: ${props => props.theme.color.accent};
  }

  .react-datepicker__navigation--previous--disabled,
  .react-datepicker__navigation--previous--disabled:hover {
    border-right-color: #e6e6e6;
    cursor: default;
  }

  .react-datepicker__navigation--next {
    right: 10px;
    border-left-color: ${props => props.theme.color.text};
  }

  .react-datepicker__navigation--next:hover {
    border-left-color: ${props => props.theme.color.accent};
  }

  .react-datepicker__navigation--next--disabled,
  .react-datepicker__navigation--next--disabled:hover {
    border-left-color: #e6e6e6;
    cursor: default;
  }

  .react-datepicker__month-container {
    float: left;
  }

  .react-datepicker__month {
    margin: 0.4rem;
    text-align: center;
  }

  .react-datepicker__month .react-datepicker__month-text,
  .react-datepicker__month .react-datepicker__quarter-text {
    display: inline-block;
    width: 4rem;
    margin: 2px;
  }

  .react-datepicker__day-names {
    white-space: nowrap;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    display: inline-block;
    width: 1.7rem;
    line-height: 1.7rem;
    text-align: center;
    margin: 0.166rem;
  }

  .react-datepicker__day {
    cursor: pointer;
  }

  .react-datepicker__day--today {
    font-weight: bold;
  }

  .react-datepicker__day:hover,
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    border-radius: 0.3rem;
    background-color: ${props => props.theme.color.secondary};
    color: #fff;
  }

  .react-datepicker__day:hover,
  .react-datepicker__day--selected:hover,
  .react-datepicker__day--keyboard-selected:hover {
    background-color: ${props => props.theme.color.accent};
  }

  .react-datepicker__day--disabled,
  .react-datepicker__month-text--disabled,
  .react-datepicker__quarter-text--disabled {
    cursor: default;
    color: ${props => props.theme.color.textSubtle};
  }

  .react-datepicker__day--disabled:hover {
    background-color: transparent;
  }
`;
