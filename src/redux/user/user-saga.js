import {takeLatest,put,all,call} from 'redux-saga/effects'
import {auth, googleProvider,createUserProfileDocument,getCurrentUser} from "../../firebase/firebase.utils";
import UserActionTypes from "./user-action-type";
import {signInFailure, signInSuccess} from "./user-action";


export function* getSnapshotFromUserAuth(userAuth) {
    try{
        const userRef = yield call(createUserProfileDocument,userAuth)
        const userSnapShot = yield userRef.get();
        yield put(
            signInSuccess({id:userSnapShot.id,...userSnapShot.data()})
        )
    }catch (e) {
        yield put(signInFailure(e))
    }
}
export function* signInWithGoogle() {
    try{
        const {user} = yield auth.signInWithPopup(googleProvider)
        yield getSnapshotFromUserAuth(user)
    } catch (e) {
        yield put(signInFailure(e))
    }
}
export function* signInWithEmail({payload:{email,password}}) {
    try{
        const {user} = yield auth.signInWithEmailAndPassword(email,password)
         yield getSnapshotFromUserAuth(user)
    } catch (e) {
    yield put(signInFailure(e))
    }
}

 export function* isUserAuthenticated() {
    try{
        const userAuth = yield getCurrentUser()
        if(!userAuth) return
        yield  getSnapshotFromUserAuth(userAuth)
    }catch (e) {
        yield put(signInFailure(e))
    }
 }
export function* onGoogleSignInStart() {
 yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START,signInWithGoogle)
}
export function* onEmailSignInStart() {
    yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START,signInWithEmail)
}
export function* onCheckUserSession() {
    yield takeLatest(UserActionTypes.CHECK_USER_SESSION,isUserAuthenticated)
}
export function* userSagas() {
    yield all([call(onGoogleSignInStart),call(onEmailSignInStart),call(onCheckUserSession)])
}
