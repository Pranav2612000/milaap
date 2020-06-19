export const handleSubmit = jest.fn();
const Register = jest.fn().mockImplementation(() => {
  return {
    handleSubmit: handleSubmit
  };
});
export default Register;
