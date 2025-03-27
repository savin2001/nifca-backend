const bcrypt = require("bcryptjs");

const password = "adminpassword123"; // The password you want to use
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log("Hashed password:", hash);
});