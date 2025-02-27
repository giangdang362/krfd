import { Rule } from 'antd/lib/form';

export const formItemRule = {
  required: () => {
    return {
      required: true,
      message: 'This field is required',
    } as Rule;
  },

  minLength: (min: number) =>
    ({
      min,
      message: `This field must be at least ${length} characters`,
    } as Rule),

  maxLength: (max: number) => ({
    max,
    message: `This field has a maximum of ${max} characters`,
  }),

  maxItem: (max: number) => ({
    max,
    message: `This field has a maximum of ${max} items`,
  }),

  notEmpty: () =>
    ({
      whitespace: true,
      message: 'This field cannot be empty',
    } as Rule),
  email: () =>
    ({
      type: 'email',
      message: 'Invalid email',
    } as Rule),
  pattern: (pattern: RegExp) => ({
    pattern: pattern,
    message: 'Data invalid',
  }),
};
