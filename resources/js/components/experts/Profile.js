import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Moment from "moment";
import { fetchExpert, fetchGeoTimezone } from "../../api";
import { GlobalContext } from "../../context/Global";
import Spinner from "../partials/Spinner";

export default () => {
    let { id } = useParams();
    const [expert, setExpert] = useState([]);
    const [userTimezone, setUserTimezone] = useState("");
    const [userOffset, setUserOffset] = useState(0);
    const { ip } = useContext(GlobalContext);

    const TimeDiff = ({ e_st, e_et, u_timezone, e_utc, u_utc }) => {
        const off_st = Moment.utc(e_st)
            .utcOffset(u_utc - e_utc)
            .format("LLL");
        const off_et = Moment.utc(e_et)
            .utcOffset(u_utc - e_utc)
            .format("LLL");

        return (
            <p className="mb-8 leading-relaxed text-lg">
                Working Hours (in&nbsp;
                {u_timezone
                    .split("/")
                    .pop()
                    .replace(/_/g, " ")}
                ):&nbsp;
                {off_st} - {off_et}
            </p>
        );
    };

    useEffect(() => {
        fetchGeoTimezone(ip)
            .then(data => {
                setUserTimezone(data.timezone);
                setUserOffset(data.timezone_offset);
                console.log(
                    `🌐 IP Address: ${data.geo.ip}\n\r📍 Location: ${data.geo.city}\n\r⌛ Timezone: ${data.timezone}\n\r`
                );
            })
            .catch(err => console.log(err));

        fetchExpert(id)
            .then(data => setExpert(data))
            .catch(err => console.log(err));
    }, [ip, id]);

    if (expert === null || expert.length === 0 || expert === undefined)
        return <Spinner />;
    else {
        return (
            <section id="expert" className="text-gray-700 body-font">
                <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
                    <div className="w-32 h-32 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
                        <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="w-16 h-16"
                            viewBox="0 0 24 24"
                        >
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div className="text-center lg:w-2/3 w-full">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                            {expert.name}
                        </h1>
                        <p className="leading-relaxed text-xl">
                            {expert.profession}
                        </p>
                        <p className="mb-8 leading-relaxed text-xl">
                            {expert.country}
                        </p>
                        <p className="mb-8 leading-relaxed text-lg">
                            Working Hours (in {expert.country}):&nbsp;
                            {Moment(expert.st).format("LLL")}
                            {" - "}
                            {Moment(expert.et).format("LLL")}
                        </p>
                        {userTimezone && (
                            <TimeDiff
                                e_st={expert.st}
                                e_et={expert.et}
                                u_timezone={userTimezone}
                                e_utc={expert.timezone}
                                u_utc={userOffset}
                            />
                        )}
                        <div className="flex justify-center">
                            <Link
                                to={`/book/${expert.id}`}
                                className="bg-indigo-700 hover:bg-gray-100 text-white hover:text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition duration-200"
                            >
                                Book Now
                            </Link>
                            <Link to="/experts">
                                <button className="ml-4 bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow transition duration-200">
                                    View other experts
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
};
