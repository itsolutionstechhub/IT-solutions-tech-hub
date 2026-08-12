import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export async function incrementDownloadCount(postId) {
  if (!postId) return;
  try {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        downloads: increment(1)
      });
    } else {
      await setDoc(docRef, {
        downloads: 1
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error incrementing download count:', error);
  }
}
