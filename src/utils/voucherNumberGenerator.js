export const generateVoucherNumber = async(
    axiosInstance,
) => {
    try {
        const currentDate = new Date()

        const currentYear =
            currentDate.getFullYear()

        const currentMonth =
            currentDate.getMonth() + 1

        let financialYear = ''

        if (currentMonth >= 4) {
            financialYear =
                `${currentYear
          .toString()
          .slice(-2)}-${(
          currentYear + 1
        )
          .toString()
          .slice(-2)}`
        } else {
            financialYear =
                `${(
          currentYear - 1
        )
          .toString()
          .slice(-2)}-${currentYear
          .toString()
          .slice(-2)}`
        }

        const response =
            await axiosInstance.get(
                '/raisePO/latest-voucher', {
                    params: {
                        financialYear,
                    },
                },
            )

        let sequenceNumber = 1

        if (
            response.data &&
            response.data.success &&
            response.data.data &&
            response.data.data.voucherNo
        ) {
            const lastVoucher =
                response.data.data.voucherNo

            const match = lastVoucher.match(
                /^STELE\/(\d{2})\/\d{2}-\d{2}$/,
            )

            if (match && match[1]) {
                sequenceNumber =
                    parseInt(match[1], 10) + 1
            }
        }

        const paddedSequence =
            sequenceNumber
            .toString()
            .padStart(2, '0')

        return `STELE/${paddedSequence}/${financialYear}`
    } catch (error) {
        console.error(
            'Error generating voucher number:',
            error,
        )

        const currentDate = new Date()

        const currentYear =
            currentDate.getFullYear()

        const currentMonth =
            currentDate.getMonth() + 1

        let financialYear = ''

        if (currentMonth >= 4) {
            financialYear =
                `${currentYear
          .toString()
          .slice(-2)}-${(
          currentYear + 1
        )
          .toString()
          .slice(-2)}`
        } else {
            financialYear =
                `${(
          currentYear - 1
        )
          .toString()
          .slice(-2)}-${currentYear
          .toString()
          .slice(-2)}`
        }

        return `STELE/01/${financialYear}`
    }
}