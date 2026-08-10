import { check } from "express-validator";


const validations=[
    //name check

  check("name")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name cannot be less than 2 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only have english alphabets"),

  //email check

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  //Password check

  check("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("The length of password must be atleast 8"),

  //confirm password

  check('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Confirm Password does not match Password');
        }
        return true;
  })

]

export default validations;