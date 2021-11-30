// to store a username with password in mongoose, we need to do some
// perquisites before storing them. When it comes to password,
// we should make sure that we are storing a hashed password
// that is associated with the username.
// because it is a huge mistake to store it as a plain text.
// think of it that way, if hackers could have accessed to the db
// they will see a hashed password that does not make any sense.
// The only way to find a hashed password or message is through
// 'Brute-force search' and 'Rainbow-table' which both require a lot of time.

// hashed password = **** slat + password + slat ***
// *** === think of it as a hashing machine

// what do we need to do?
// 1. stored a hashed password in database
// 2. create a method to find the inputted-password match the hashed one

// To hash a password, we need a hashing machine that could do that for us.
// And to have this machine, npm provides a great library called bcrypt.js
// it's going to include hash encryption along with a work factor, which
// allows for us see how expensive the hashing process can cost us.
// by increasing the work factor the more its going to be hard for hackers to find
// out what the hashed password is.

// objectives
// 1. the logic behind password encrypting and verification login should be fully encapsulated
// 2. password should encrypted before storing
// 3. it should resist the logic error when we have something wrong with our password
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const round = process.env.HASHING_ROUND;
const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	bcrypt = require("bcryptjs"),
	round = 12;

// before we send our password to the database, we need to make sure
// it is a unique user and also has a hashed password

const schema = new Schema({
	username: {
		type: String,
		index: { unique: true },
		validate: {
			validator: function (val) {
				return val.length >= 2;
			},
			message: "Username is should longer 5 characters",
		},
		require: [true, "Username is not valid"],
	},
	password: {
		type: String,
		require: [true, "Password is not valid"],
		validate: {
			validator: function (val) {
				return val.length > 6;
			},
		},
		message: "Password should longer than 6 characters",
	},
});

// password hashing
schema.pre("save", function (next) {
	let user = this;
	// if user nor modified the password or isnt a new user
	if (!user.isModified("password")) return next();

	// generate a salt
	bcrypt.genSalt(round, function (saltErr, salt) {
		if (saltErr) return next(`Salt error ${saltErr}`);

		// hash the password
		bcrypt.hash(user.password, salt, function (hashErr, hash) {
			if (hashErr) return next(`Hash error ${hashErr}`);
			user.password = hash;
			next();
		});
	});
});

// password verification
schema.methods.comparePassword = function (clientPassword, cb) {
	let hash = this.hash;
	bcrypt.compare(clientPassword, hash, function (passwordComparedErr, isMatch) {
		if (passwordComparedErr) {
			return cb(`passwordComparedErr: ${passwordComparedErr}`);
		}
		cb(null, isMatch);
	});
};

// mongoose called another hooked before "save function".
// which the pre("validate")
// and also this function would've used before any documents sent to the db
schema.pre("save", function (next) {
	let user = this;
	// if we have a new user sign up, or a user changes the password
	// then buckle up and hash the password. otherwise, this pre function dose not need to do anything
	if (!user.isModified("password") || !user.isNew) return next();

	//generate a salt
	bcrypt.genSalt(
		round /* The higher the number is the
                longer it takes to hash the a password
                and the harder it get for the hacker to
                guess the hashed password */,
		// it return a function that generates a salt
		(saltErr, salt) => {
			if (saltErr) return next(saltErr);
			// we are gonna use the slat here with password value
			bcrypt.hash(user.password, salt, (hashError, hash) => {
				if (hashError) return next(hashError);
				// now have a hashed password
				user.password = hash;
				next();
			});
		}
	);
});

schema.methods.comparePassword = function (userPassword, cb) {
	bcrypt.compare(userPassword, this.password, (err, isMatch) => {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model("Users", schema);
