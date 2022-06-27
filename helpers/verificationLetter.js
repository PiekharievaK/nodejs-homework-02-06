const verificationLetter = (email, verificationToken) => {
  return {
    to: email,
    subject: "Подтверждение email",
    html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}"> Подтвердить email </a>`,
  };
};
module.exports = verificationLetter;
