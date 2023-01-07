// import { RequestHandler } from "express";
// import { useMemory } from "..";
// import { getDoc, doc, setDoc } from "firebase/firestore";

// export const createUser: RequestHandler = async (req, res, next) => {

//     const { db, logger } = useMemory(),
//         { email, name, pwr_assoc, role } = req.body,
//         pwr_association = (pwr_assoc as [boolean, boolean]).map((v) => v ? 1 : 0),
//         user = { name, pwr_association, role };


//     try {
//         await setDoc(doc(db, "users", email), user);
//     } catch (e) {
//         logger.info(e);
//         res.status(500).send("Failed to register user in permission service: " + e);
//     }

//     res.status(200).send();

//     return next();
// };


// export const isAdmin: RequestHandler = async (req, res, next) => {
//     const { db, logger } = useMemory(),
//         { email } = req.body,
//         userRef = doc(db, "users", email);

//     try {
//         const user = await getDoc(userRef);
//         if (!user.exists()) {

//             res.status(400).send(JSON.stringify({msg: `Failed to find user with email: ${email}`}));
//             return next();
//         }

//         const { role } = user.data(),
//             response = {
//                 mail: email,
//                 isAdmin: (role as number) === 1,
//             };


//         res.status(200).send(JSON.stringify(response));

//         return next();
//     } catch (e) {
//         logger.info(e);
//         res.status(500).send("Failed to fetch user from firestore: " + e);
//     }
// };
