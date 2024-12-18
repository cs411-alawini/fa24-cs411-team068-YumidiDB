const startAuthenticatedSession = (req, user, cb) => {
    return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if (err) {
                reject(err);
            } else {
                req.session.user = user;
                resolve(user);
            }
        });
    });
}; // startAuthenticatedSession



const endAuthenticatedSession = (req, cb): Promise<void> => {
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}; // endAuthenticatedSession




export {
    startAuthenticatedSession,
    endAuthenticatedSession
};