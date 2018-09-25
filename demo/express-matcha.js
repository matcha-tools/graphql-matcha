function matchaWrap(schema){

  function matcha(req,res,next){
    next();
  }

  return matcha;
}


module.exports ={
  matchaWrap
}