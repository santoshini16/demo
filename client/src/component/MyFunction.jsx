// import { useState } from "react";
// import formatDate from "../utils/formatDate";
// import formatToken from "../utils/formatToken";
// import { EditQA } from "./editQA/EditQA";
// import { EditPoll } from "./editPoll/EditPoll";
// import { DeleteQuizModal } from "./deleteQuizModal/DeleteQuizModal";
// import styles from "../pages/analytics/Analytics.module.css";
// import { EditSVG,deleteSVG,shareSVG } from "../data/IconSvgs";
// import { Link } from "react-router-dom";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const MyFunction = ({ analytic, i }) => {
//   console.log(analytic,i)
//     const [openEditQuizModal, setOpenEditQuizModal] = useState(false);
//     const [openDeleteQuizModal, setOpenDeleteQuizModal] = useState(false);

//     const handleShareQuiz = (quizId) => {
//         navigator.clipboard.writeText(`http://localhost:5173/playquiz/${quizId}`)
//           .then(() => {
//             toast.success("Link copied to clipboard");
//           })
//           .catch((error) => {
//             toast.error("Failed to copy the link");
//           });
//       };
      
  
//     return (
   
//         <tr key={analytic._id}>
//         <td>{i + 1}</td>
//         <td>{analytic?.quizName}</td>
//         <td>{formatDate(analytic?.createdAt)}</td>
//         <td>{formatToken(analytic?.impressions)}</td>
//         <td className={styles.actions}>
//           <span
//             title="edit"
//             className={styles.icon}
//             onClick={() => {
//               setOpenEditQuizModal(true);
//             }}
//           >
//             {EditSVG}
//           </span>
  
//           {analytic.quizType === "QA" && (
//             <EditQA
//               openEditQuizModal={openEditQuizModal}
//               setOpenEditQuizModal={setOpenEditQuizModal}
//               quId={analytic._id}
//             />
//           )}
  
//           {analytic.quizType === "POLL" && (
//             <EditPoll
//               openEditQuizModal={openEditQuizModal}
//               setOpenEditQuizModal={setOpenEditQuizModal}
//               quId={analytic._id}
//             />
//           )}
  
//           <span
//             title="delete"
//             className={styles.icon}
//             onClick={() => {
//               setOpenDeleteQuizModal(true);
//             }}
//           >
//             {deleteSVG}
//           </span>
  
//           <DeleteQuizModal
//             openDeleteQuizModal={openDeleteQuizModal}
//             setOpenDeleteQuizModal={setOpenDeleteQuizModal}
//             quId={analytic._id}
//           />
  
//           <span
//             className={styles.icon}
//             title="share"
//             onClick={() => handleShareQuiz(analytic._id)}
//           >
//             {shareSVG}
//           </span>
//         </td>
//         <td>
//           <Link
//             to={`/questionWise/${analytic._id}`}
//             className={styles.link}
//           >
//             <span className={styles.questionWise}>Question Wise Analysis</span>
//           </Link>
//         </td>
//         <ToastContainer/>
//       </tr>
//     );
//   };

//   export default MyFunction;

import React, { useState } from "react";
import axios from "axios";
import formatDate from "../utils/formatDate";
import formatToken from "../utils/formatToken";
import { EditQA } from "./editQA/EditQA";
import { EditPoll } from "./editPoll/EditPoll";
import { DeleteQuizModal } from "./deleteQuizModal/DeleteQuizModal";
import styles from "../pages/analytics/Analytics.module.css";
import { EditSVG, deleteSVG, shareSVG } from "../data/IconSvgs";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyFunction = ({ analytic, i, onDeleteSuccess }) => {
  const [openEditQuizModal, setOpenEditQuizModal] = useState(false);
  const [openDeleteQuizModal, setOpenDeleteQuizModal] = useState(false);

  const handleShareQuiz = (quizId) => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5173";
    navigator.clipboard.writeText(`${baseUrl}/playquiz/${quizId}`)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy the link");
      });
  };

  const handleDeleteSuccess = () => {
    toast.success("Quiz deleted successfully");
    onDeleteSuccess(analytic._id); // Notify parent to remove the quiz from the list
    setOpenDeleteQuizModal(false); // Close the modal
  };

  return (
    <tr key={analytic._id}>
      <td>{i + 1}</td>
      <td>{analytic?.quizName}</td>
      <td>{formatDate(analytic?.createdAt)}</td>
      <td>{formatToken(analytic?.impressions)}</td>
      <td className={styles.actions}>
        <span
          title="edit"
          className={styles.icon}
          onClick={() => setOpenEditQuizModal(true)}
        >
          {EditSVG}
        </span>

        {analytic.quizType === "QA" && (
          <EditQA
            openEditQuizModal={openEditQuizModal}
            setOpenEditQuizModal={setOpenEditQuizModal}
            quId={analytic._id}
          />
        )}

        {analytic.quizType === "POLL" && (
          <EditPoll
            openEditQuizModal={openEditQuizModal}
            setOpenEditQuizModal={setOpenEditQuizModal}
            quId={analytic._id}
          />
        )}

        <span
          title="delete"
          className={styles.icon}
          onClick={() => setOpenDeleteQuizModal(true)}
        >
          {deleteSVG}
        </span>

        <DeleteQuizModal
          openDeleteQuizModal={openDeleteQuizModal}
          setOpenDeleteQuizModal={setOpenDeleteQuizModal}
          quId={analytic._id}
          onDeleteSuccess={handleDeleteSuccess} // Pass the callback here
        />

        <span
          className={styles.icon}
          title="share"
          onClick={() => handleShareQuiz(analytic._id)}
        >
          {shareSVG}
        </span>
      </td>
      <td>
        <Link
          to={`/questionWise/${analytic._id}`}
          className={styles.link}
        >
          <span className={styles.questionWise}>Question Wise Analysis</span>
        </Link>
      </td>
      <ToastContainer />
    </tr>
  );
};

export default MyFunction;