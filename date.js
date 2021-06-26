
module.exports.getDay=function(){

  const today=new Date();
  const currentday=today.getDay();
  const options={
    weekday:"long",
    day:"numeric",
    month:"long"
  }
  return today.toLocaleDateString("en-US",options);

}
