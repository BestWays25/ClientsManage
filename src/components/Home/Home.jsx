import React from "react";
import HomeImage from '../../assets/meeting.svg';
const HomePage = () => {

    return (
        <>
            <header class="pt-5">
                <div class="container pt-4 pt-xl-5">
                    <div class="row pt-5">
                        <div class="col-md-8 text-center text-md-start mx-auto">
                            <div class="text-center">
                                <h1 class="display-4 fw-bold mb-5">Tools for teams that work&nbsp;<span class="underline">together</span>.</h1>
                                <p class="fs-5 text-muted mb-5">Metus quisque ultricies vehicula proin, magna nullam.</p>
                                <form class="d-flex justify-content-center flex-wrap" method="post" data-bs-theme="light">
                                    <div class="shadow-lg mb-3"><input class="form-control" type="email" name="email" placeholder="Your Email" /></div>
                                    <div class="shadow-lg mb-3"><button class="btn btn-primary" type="submit">Subscribe </button></div>
                                </form>
                            </div>
                        </div>
                        <div class="col-12 col-lg-10 mx-auto">
                            <div class="text-center position-relative"><img class="img-fluid" src={HomeImage} style={{width: "800px"}}/></div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
export default HomePage;