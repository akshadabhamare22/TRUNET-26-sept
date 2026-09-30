export const generateOrderNumber = async(
    axiosInstance,
    type = 'stocktransfer',
) => {
    try {
        const storedCenter =
            localStorage.getItem('userCenter')

        const userCenter = storedCenter ?
            JSON.parse(storedCenter) :
            {}

        const centerName =
            userCenter &&
            userCenter.centerName ?
            userCenter.centerName.replace(/\s+/g, '') :
            'DEFAULTCENTER'

        const now = new Date()

        const month = String(
            now.getMonth() + 1,
        ).padStart(2, '0')

        const year = String(
            now.getFullYear(),
        ).slice(-2)

        const monthYear = month + year

        const config = {
            stocktransfer: {
                apiEndpoint: '/stocktransfer/latest-transfer-number',
                prefix: 'TF',
            },

            stockrequest: {
                apiEndpoint: '/stockrequest/recent-order-number',
                prefix: 'SR',
            },
        }

        const selectedConfig =
            config[type] || config.stocktransfer

        const apiEndpoint =
            selectedConfig.apiEndpoint

        const prefix = selectedConfig.prefix

        const response =
            await axiosInstance.get(apiEndpoint)

        let serialNumber = 1

        if (
            response &&
            response.data &&
            response.data.success &&
            response.data.data
        ) {
            const lastOrderNo =
                response.data.data.orderNumber ||
                response.data.data.transferNumber

            if (lastOrderNo) {
                const parts = lastOrderNo.split('/')

                if (parts.length >= 2) {
                    const lastSerial = parseInt(
                        parts[parts.length - 1],
                        10,
                    )

                    if (!isNaN(lastSerial)) {
                        serialNumber =
                            lastSerial + 1
                    }
                }
            }
        }

        return (
            prefix +
            '/' +
            centerName.toUpperCase() +
            '/' +
            monthYear +
            '/' +
            serialNumber
        )
    } catch (error) {
        console.error(
            'Error generating order number:',
            error,
        )

        const storedCenter =
            localStorage.getItem('userCenter')

        const userCenter = storedCenter ?
            JSON.parse(storedCenter) :
            {}

        const centerName =
            userCenter &&
            userCenter.centerName ?
            userCenter.centerName.replace(/\s+/g, '') :
            'DEFAULTCENTER'

        const now = new Date()

        const month = String(
            now.getMonth() + 1,
        ).padStart(2, '0')

        const year = String(
            now.getFullYear(),
        ).slice(-2)

        const monthYear = month + year

        const prefix =
            type === 'stockrequest' ?
            'SR' :
            'TF'

        return (
            prefix +
            '/' +
            centerName.toUpperCase() +
            '/' +
            monthYear +
            '/1'
        )
    }
}