export const formatDateTime = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)

    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

export const formatDate = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export const formatDisplayDate = (
    startDate,
    endDate,
) => {
    if (!startDate || !endDate) {
        const currentDate = new Date()

        const month = currentDate.toLocaleString(
            'default', {
                month: 'long',
            },
        )

        const year = currentDate.getFullYear()

        return `Month : ${month} - ${year}`
    }

    const format = (dateStr) => {
        if (!dateStr) return ''

        const [day, month, year] =
        dateStr.split('-')

        const date = new Date(
            `${year}-${month}-${day}`,
        )

        return date.toLocaleDateString(
            'en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            },
        )
    }

    const formattedStart = format(startDate)
    const formattedEnd = format(endDate)

    if (formattedStart === formattedEnd) {
        return `Date : ${formattedStart}`
    }

    return `Date : ${formattedStart} TO ${formattedEnd}`
}