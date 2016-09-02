export const fetchData = function (url, params = {}, type = "POST") {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: type,
            url: url,
            data: params,
            success: function (returnData, status, xhr) {
                if (returnData.status === "error") {
                    reject(new Error(returnData.error.message));
                    return;
                }
                resolve(returnData.data);
            },
            error: function (err) {
                if (err.responseText === "") {
                    err = new Error("Please start your server.")
                }
                reject(err)
            },
            dataType: 'JSON',
            async: true
        });
    });
};