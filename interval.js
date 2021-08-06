'use strict';

module.exports.handle = async (event) => {
  console.log(event);
  console.log("The time is", new Date());
  return event;
};
