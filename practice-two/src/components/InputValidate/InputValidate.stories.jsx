import { MESSAGES } from '@constants';
import InputValidate from './InputValidate';

export default {
  title: 'Components/InputValidate',
  component: InputValidate,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    type: { control: 'select', options: ['text', 'radio'] },
    placeholder: { control: 'text' },
    errorMessage: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
    genderType: { control: 'text' },
  },
};

const Template = (args) => <InputValidate {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Full name',
  errorMessage: MESSAGES.FORM.USERNAME,
  name: 'username',
};

export const Email = Template.bind({});
Email.args = {
  label: 'Email',
  placeholder: 'example@gmail.com',
  errorMessage: MESSAGES.FORM.EMAIL,
  name: 'email',
};

export const GenderRadio = Template.bind({});
GenderRadio.args = {
  type: 'radio',
  errorMessage: '',
  value: 'male',
  name: 'gender',
  genderType: 'male',
};
