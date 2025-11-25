/* 
usersRoles: {
   BASE: 1001,
   POWER: 3001,
   ADMIN: 5001
}
   config min priviledges for each route/action
*/

const priviledgesConfig = {
  users: {
    GET: 3000,
    POST: 5000,
    PUT: 5000,
    DELETE: 5000,
  },
  reklamacije: {
    GET: 1000,
    POST: 1000,
    PUT: 1000,
    DELETE: 5000,
  },
  uploads: {
    POST: 3000,
    DELETE: 3000,
  },
  jci: {
    GET: 1000,
    POST: 1000,
    PUT: 1000,
    DELETE: 5000,
  },
  otpad: {
    "vrste-otpada": {
      GET: 1000,
      POST: 1000,
      PUT: 1000,
      DELETE: 5000,
    },
    jci: {
      GET: 1000,
      POST: 1000,
      PUT: 1000,
      DELETE: 5000,
    },
    proizvodi: {
      GET: 1000,
      POST: 1000,
      PUT: 1000,
      DELETE: 5000,
    },
    delovodnik: {
      GET: 1000,
    },
  },
  nabavke: {
    proizvodi: {
      GET: 1000,
      POST: 1000,
      PUT: 1000,
      DELETE: 5000,
    },
    porudzbine: {
      GET: 1000,
      POST: 1000,
      PUT: 1000,
      DELETE: 5000,
    },
  },
};

export default priviledgesConfig;
