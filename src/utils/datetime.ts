// convert datetime
// ex: 2023-10-02T21:03:16.044967+07:00 ==> 02/10/2020, 21:03
export const FormatDateTime = (inputDateString: string) => {
  const inputDate = new Date(inputDateString);

  const outputDate = inputDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${outputDate}`;
};

// ex: 2023-10-02T21:03:16.044967+07:00 ==> 02/10/2020
export const FormatBirthday = (inputDateString: string) => {
  const inputDate = new Date(inputDateString);

  const outputDate = inputDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return `${outputDate}`;
};

// ex: 2023-10-02T21:03:16.044967+07:00 ==> 2023-10-02
export const FormatEsalisday = (inputDateString: string) => {
  const inputDate = new Date(inputDateString);
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');

  const outputDate = `${year}-${month}-${day}`;

  return outputDate;
};
