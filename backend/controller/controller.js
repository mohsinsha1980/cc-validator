const validateCCNumber = (req, res) => {
    try {
        if (!req.body.ccNumber) {
            return res.status(400).json({error: true, status: 'invalid', message: 'Credit card number is required!'});
        }
        if (req.body.ccNumber && ccNumberValidator(req.body.ccNumber)) {
            return res.json({error: false, status: 'valid', message: 'Credit card number is valid!'});
        } else {
            return res.json({error: true, status: 'invalid', message: 'Credit card number is invalid!'});
        }
    } catch(e) {
        console.log(e);
        res.status(500).json({error: true, status: 'invalid', message: 'Something went wrong. Please contact administrator'});
    }
};

function ccNumberValidator(input) {
    if (!input || !input.length) {
        return false;
    }
    let ccInt = input.split('').map(Number);
    for (let i = ccInt.length - 2; i >= 0; i = i - 2) {
        let tempVal = ccInt[i];
        tempVal = tempVal * 2;
        if (tempVal > 9) {
            tempVal = tempVal % 10 + 1;
        }
        ccInt[i] = tempVal;
    }
    const total = ccInt.reduce((acc, num) => acc + num, 0);
    return total % 10 === 0;
};

module.exports = {
    validateCCNumber
}