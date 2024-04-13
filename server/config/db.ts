let LOCAL = true;

let HostName, URI;

if(LOCAL) {
    let URI = "mongodb://localhost/contacts";
    HostName = "localhost"
}else{
    HostName = "Mongo DB Atlas";
    URI = "mongodb+srv://merchii:OgURMSOuQ8xRzwds@cluster0.d0owxem.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0"
}

export { HostName, URI }
export const SessionSecret = "INFT2202SessionSecret";

// export const RemoteURI = "mongodb+srv://merchii:OgURMSOuQ8xRzwds@cluster0.d0owxem.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0"

//OgURMSOuQ8xRzwds