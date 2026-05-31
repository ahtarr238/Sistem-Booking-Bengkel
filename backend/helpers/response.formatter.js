'use strict';

const response = (status, message, data = null) => {
    return {
        status,
        message,
        data,
    };
};

module.exports = {
    response,
};
