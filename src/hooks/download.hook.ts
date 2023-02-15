export function downloadFun(fileName: string, res: any) {
    let a = document.createElement("a");
    let url = window.URL.createObjectURL(res);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}
