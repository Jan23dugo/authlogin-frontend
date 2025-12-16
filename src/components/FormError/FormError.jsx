function FormError({ message }) {
  if (!message) return null;
  return <p style={{ color: "red", marginBottom: "10px" }}>{ message } </p>;
}

export default FormError;
