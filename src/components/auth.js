import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db, storage } from '../config/firebase.js'
import { getDocs, collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { uploadBytes, ref } from 'firebase/storage';

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [movies, setMovies] = useState([]);

    const [movieName, setMovieName] = useState("");
    const [heroName, setHeroName] = useState("");
    const [rating, setRating] = useState(0);

    const [newTitle, setNewTitle] = useState("");
    const [fileUploaded, setFileUploaded] = useState(null);

    const signIn = async () => {
        try{
            await createUserWithEmailAndPassword(auth, email, password);
        }catch(err){
            console.error(err);
        }
    }

    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth, googleProvider);
        }catch(err){
            console.error(err);
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
        }catch(err){
            console.error(err);
        }
    }

    console.log(auth?.currentUser?.email);

    const getMovies = async () => {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((res) => ({
            ...res.data(),
            id: res.id
        }))
        setMovies(filteredData);
    }

    const moviesCollectionRef = collection(db, "movies");
    useEffect(() => {
        getMovies();
    }, [])

    const submitMovie = async() => {
        try{
            await addDoc(moviesCollectionRef, {
                title: movieName,
                hero: heroName,
                rating: rating,
                userId: auth?.currentUser?.uid
            })

            getMovies();
        }catch(err){
            console.error(err);
        }
    }

    const deleteMovie = async (id) => {
        try{
            const movieDoc = doc(db, "movies", id);
            await deleteDoc(movieDoc);
            getMovies();
        }catch(err){
            console.error(err);
        }
    }

    const updateMovie = async(id) => {
        try{
            const movieDoc = doc(db, "movies", id);
            await updateDoc(movieDoc, {title: newTitle});
            getMovies();
        }catch(err){
            console.error(err);
        }
    }

    const uploadFile = async() => {
        try{
            if(!fileUploaded) return;
            const fileRef = ref(storage, `projectFiles/${fileUploaded.name}`);
            await uploadBytes(fileRef, fileUploaded);
            console.log("uploaded")
        }catch(err){
            console.error(err);
            console.log("Not uploaded")
        }
    }
    return (
        <div>
            <input type="text" placeholder="Email..." onChange={e => setEmail(e.target.value)} required/>
            <br />
            <input type="password" placeholder="Password..." onChange={e => setPassword(e.target.value)} required/>
            <br />
            <button onClick={signIn}> Submit </button>
            <button onClick={signInWithGoogle}>Sign In with Google</button>
            <button onClick={logout}>Logout</button>
            <input type="text" placeholder='Movie name...' onChange={e => setMovieName(e.target.value)}/>
            <input type="text" placeholder='Hero name...' onChange={e => setHeroName(e.target.value)}/>
            <input type="text" placeholder='Rating...' onChange={e => setRating(Number(e.target.value))}/>
            <button onClick={submitMovie}>Submit Movie</button>
            {movies.map((movie) => {
                return (
                    <div>
                        <h1 style={{color: movie.rating > 8 ? "green" : "red"}}> {movie.title} </h1>
                        <p>{movie.hero}</p>
                        <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
                        <input type="text" placeholder='Different title...'onChange={e => setNewTitle(e.target.value)}/>
                        <button onClick={() => updateMovie(movie.id)}>Update title</button>
                        <input type="file" onChange={e => setFileUploaded(e.target.files[0])}/>
                        <button onChange={uploadFile}>Upload File</button>
                    </div>
                )
            })}
        </div>
    )
}