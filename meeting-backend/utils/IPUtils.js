const os = require('os');

function getIPAdress() {
	let re = ''
	Object.values(os.networkInterfaces()).forEach(inner => {
		inner.forEach(item => {
			if (item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal)
				re = item.address
		})
	})
	return re
}

module.exports = getIPAdress;