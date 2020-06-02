export function ValidationException(errors) {
   this.errors = errors;
   this.name = 'ValidationException';
}

export function UnknownException(description) {
    this.description = description;
    this.name = "UnknownException";
}

export function AuthorizationException(description) {
    this.description = description;
    this.name = "AuthorizationException"
}