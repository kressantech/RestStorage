const my = require ("./my.js")

module.exports = function (req,res,next)
{
	if ( config.enableAccessKey)
	{
		if ( req.headers['secured-access-key'] != config.accessKey )
			{return my.resErr(res,"Access Denied - INVALD_KEY")}
	}
	return next()
}