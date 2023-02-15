import BaseAxios from "../base_axios";
import ResHelper from "../ResHelper";

// 数据供应
export function postDataApi(file: File, mode: string = "append") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("dstDeltaTablePath", "D:/dataLake/" + file.name);
    formData.append("mode", mode);
    return BaseAxios({
        url: `data/uploadFile`,
        headers: {
            "Content-Type": "multipart/form-data; boundary=something",
        },
        method: "post",
        data: formData,
    }).then(ResHelper);
}
