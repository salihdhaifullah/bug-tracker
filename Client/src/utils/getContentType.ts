const getContentType = (fileName: string) => {
    const parts = fileName.split('.');

    if (parts.length > 1) {
        return parts[parts.length - 1];
    } else return "";
}

export default getContentType;
