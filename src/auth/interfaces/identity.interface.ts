export interface IdentityInfoI {
    fullName:       string;
    documentNumber: string;
    birthDate:      string;
    gender:         string;
}

export interface IdentityNewResponse {
    message:    string;
    statusCode: number;
    data:       Data;
}

export interface Data {
    id:            string;
    names:         string;
    firstSurname:  string;
    secondSurname: string;
    gender:        string;
    nationality:   string;
    birthPlace:    string;
    birthDate:     string;
}
