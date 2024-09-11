import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, QrCode } from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { LayoutDashboard, NotebookText, Cog, ArrowLeft } from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import { cn } from "../../utils/utils";
import InfiniteMovingCard from "../top-cards/infinite-movingComponent";
import { getMovies, getShowsByMovieId } from "../../services/api";
import SeatPicker from "../../common/SeatPicker";
import AnimatedModalDemo from "../paymentmodal/animated-modalComponent";

// Define interfaces
interface Movie {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface Show {
  id: string;
  showTime: string;
  theatre: {
    id: string;
    name: string;
  };
}

interface Seat {
  id: string;
  seatNumber: string;
  type: string;
  price: number;
  status: string;
}

interface Booking {
  id: string;
  userId: string;
  showId: string;
  seatNumbers: string[];
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalPrice: number;
  status: string;
  movieTitle: string;
  imageUrl: string;
  tickets: string[]; // Add this line

}

const SidebarDemo = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout function called");
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    console.log("Token and user details removed from localStorage");
    navigate("/login");
    console.log("Redirecting to login page");
  };

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "My Bookings",
      href: "/my-bookings",
      icon: (
        <NotebookText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Cog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-8xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[100vh]"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <button
              className="flex items-center gap-3 text-neutral-700 dark:text-neutral-200 p-3 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md"
              onClick={handleLogout}
            >
              <ArrowLeft className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Tickit
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Assume these functions exist

const SkeletonLoader = () => (
  <div className="relative flex flex-col bg-white shadow-md bg-clip-border rounded-xl w-80 m-4 animate-pulse">
    <div className="relative mx-4 mt-4 overflow-hidden bg-gray-200 rounded-xl h-96"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="p-6 pt-0">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="flex space-x-2 overflow-x-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>
        ))}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatersByMovie, setTheatersByMovie] = useState<Record<string, any>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movieResponse = await getMovies();
        setMovies(movieResponse.data);

        const theatersData: Record<string, any> = {};

        for (const movie of movieResponse.data) {
          const showResponse = await getShowsByMovieId(movie.id);
          const groupedShows = showResponse.reduce(
            (acc: Record<string, any>, show: Show) => {
              const theatreId = show.theatre.id;
              if (!acc[theatreId]) {
                acc[theatreId] = {
                  theatre: show.theatre,
                  showtimes: [],
                };
              }
              acc[theatreId].showtimes.push({
                id: show.id,
                time: show.showTime,
              });
              return acc;
            },
            {}
          );

          theatersData[movie.id] = Object.values(groupedShows);
        }

        setTheatersByMovie(theatersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies or shows:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
        <div className="p-2 bg-white dark:bg-neutral-900 overflow-y-auto">
          <form className="max-w-md mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Coming Soon..."
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled
              >
                Search
              </button>
            </div>
          </form>

          <InfiniteMovingCard />

          <div className="flex gap-2 mb-2">
            {[...new Array(4)].map((_, i) => (
              <div
                key={`genre-${i}`}
                className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
              >
                Coming Soon
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center flex-1">
            {loading
              ? [...Array(8)].map((_, index) => (
                  <SkeletonLoader key={`skeleton-${index}`} />
                ))
              : movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-80 m-4"
                  >
                    <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-96">
                      <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                          {movie.title}
                        </p>
                      </div>
                      <p
                        id={`textContent-${movie.id}`}
                        className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75 max-h-20 overflow-hidden"
                      >
                        {movie.description}
                      </p>
                      <button
                        id={`toggleButton-${movie.id}`}
                        className="mt-2 text-black-100 font-bold"
                      >
                        Show More
                      </button>
                    </div>
                    <div className="p-6 pt-0 max-h-60 overflow-y-auto no-scrollbar">
                      {theatersByMovie[movie.id]?.map(
                        (theatreData: any, index: number) => (
                          <div key={index} className="mb-4">
                            <p className="font-bold text-lg">
                              {theatreData.theatre.name}
                            </p>
                            <div className="flex overflow-x-auto no-scrollbar">
                              {theatreData.showtimes.map(
                                (showtime: any, timeIndex: number) => (
                                  <button
                                    key={timeIndex}
                                    className="border border-black rounded-full text-black-100 px-4 py-1 m-1 bg-transparent whitespace-nowrap"
                                    onClick={() =>
                                      navigate(`/booking/${showtime.id}`)
                                    }
                                  >
                                    {new Date(showtime.time).toLocaleString()}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Under Construction
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          We're working on something awesome!
        </p>
        <div className="flex justify-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingData, setBookingData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (id) {
      fetch(`//34.222.114.62:8080/api/shows/${id}/all-seats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch seats");
          }
          return response.json();
        })
        .then((data: Seat[]) => {
          setSeats(data);
        })
        .catch((error) => {
          console.error("Error fetching seat data:", error);
        });
    }
  }, [id]);

  const handleSeatSelection = (seat: Seat) => {
    setSelectedSeats((prevSeats) => {
      const alreadySelected = prevSeats.find((s) => s.id === seat.id);
      if (alreadySelected) {
        return prevSeats.filter((s) => s.id !== seat.id);
      } else {
        return [...prevSeats, seat];
      }
    });
  };

  const handleBookTicket = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
    const userId = userDetails?.id;
    const seatNumbers = selectedSeats.map((seat) => seat.seatNumber);
    const requestData = {
      userId: userId,
      showId: id ? parseInt(id) : undefined,
      seatNumbers: seatNumbers,
    };
    const token = localStorage.getItem("token");

    fetch("//34.222.114.62:8080/api/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        setBookingData(data);
        setModalOpen(true);
      })
      .catch((error) => console.error("Error booking ticket:", error));
  };

  const totalPrice = selectedSeats.reduce(
    (total, seat) => total + seat.price,
    0
  );
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
        <div className="p-2 bg-white dark:bg-neutral-900 overflow-y-auto">
          <div className="flex flex-col lg:flex-row items-start justify-between p-4 space-y-4 lg:space-y-0 lg:space-x-8">
            <SeatPicker
              seats={seats}
              selectedSeats={selectedSeats}
              handleSeatSelection={handleSeatSelection}
            />
            <div className="w-full lg:w-1/4 bg-white p-4 border rounded shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Selected Seats</h2>
              <ul>
                {selectedSeats.map((seat) => (
                  <li key={seat.id} className="mb-2">
                    {seat.seatNumber} ({seat.type}) - ${seat.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <hr className="my-4" />
              <div className="text-xl font-bold">
                Total: ${totalPrice.toFixed(2)}
              </div>
              <button onClick={handleBookTicket}> Confirm </button>

              {modalOpen && (
                <AnimatedModalDemo
                  bookingData={bookingData}
                  handleBookTicket={handleBookTicket}
                  onClose={() => setModalOpen(false)} // Add a callback to close the modal
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
interface TicketProps {
  ticket: {
    id: string;
    showId: string;
    movieTitle: string;
    imageUrl: string;
    tickets: string[];
    subtotal: number;
    convenienceFee: number;
    tax: number;
    totalPrice: number;
    status: string;
  };
}
const TicketUI: React.FC<TicketProps> = ({ ticket }) => (
  <div className="relative w-72 aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${ticket.imageUrl})` }}
    />
    <div className="absolute inset-0 bg-black opacity-50" />
    <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-white text-2xl font-bold mb-2">
          {ticket.movieTitle}
        </h2>
        <div className="flex items-center text-white opacity-80 mb-2">
          <Calendar className="mr-2" size={16} />
          <span className="text-sm">Show ID: {ticket.showId}</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center text-white">
          <MapPin className="mr-2" size={16} />
          <span className="text-sm">Seats: {ticket.tickets.join(", ")}</span>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-3 space-y-1">
          <div className="flex justify-between text-white text-xs">
            <span>Subtotal</span>
            <span>${ticket.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white text-xs">
            <span>Convenience Fee</span>
            <span>${ticket.convenienceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white text-xs">
            <span>Tax</span>
            <span>${ticket.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-white border-opacity-20">
            <span>Total</span>
            <span>${ticket.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        {ticket.status === "PAYMENT_FAILED" ? (
          <span className="bg-red-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Payment Failed
          </span>
        ) : (
          <span className="bg-green-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {ticket.status}
          </span>
        )}
        <div className="bg-white p-1 rounded">
          <QrCode className="text-black" size={40} />
        </div>
      </div>
    </div>
  </div>
);

const SkeletonLoaderbooking = () => (
  <div className="relative w-72 aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-gray-300 animate-pulse">
    <div className="absolute inset-0 p-4 flex flex-col justify-between">
      <div>
        <div className="h-8 bg-gray-400 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-1/2 mb-2"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-400 rounded w-2/3"></div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-400 rounded w-full"></div>
          <div className="h-3 bg-gray-400 rounded w-full"></div>
          <div className="h-3 bg-gray-400 rounded w-full"></div>
          <div className="h-4 bg-gray-400 rounded w-full mt-1"></div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-400 rounded-full w-1/3"></div>
        <div className="h-10 w-10 bg-gray-400 rounded"></div>
      </div>
    </div>
  </div>
);

const MyBookings: React.FC = () => {
  const [ticketData, setTicketData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
      const userId = userDetails?.id;

      try {
        const bookingsResponse = await fetch(
          `//34.222.114.62:8080/api/bookings/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!bookingsResponse.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const bookingsData = await bookingsResponse.json();

        const ticketsWithMovieDetails = await Promise.all(
          bookingsData.map(async (ticket: Booking) => {
            const showResponse = await fetch(
              `//34.222.114.62:8080/api/shows/${ticket.showId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!showResponse.ok) {
              throw new Error(`Failed to fetch show details for ticket ${ticket.id}`);
            }

            const showData = await showResponse.json();

            const movieResponse = await fetch(
              `//34.222.114.62:8080/api/movies/${showData.movieId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!movieResponse.ok) {
              throw new Error(`Failed to fetch movie details for ticket ${ticket.id}`);
            }

            const movieData = await movieResponse.json();

            return {
              ...ticket,
              imageUrl: movieData.imageUrl,
              movieTitle: movieData.title,
            };
          })
        );

        setTicketData(ticketsWithMovieDetails);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
        <div className="p-2 bg-white dark:bg-neutral-900 overflow-y-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-10">
            My Bookings
          </h1>
          <div className="flex flex-wrap gap-6 justify-center flex-1">
            {loading ? (
              // Show skeleton loaders while loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoaderbooking key={index} />
              ))
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : ticketData.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No bookings found.
              </p>
            ) : (
              ticketData.map((ticket) => (
                <TicketUI key={ticket.id} ticket={ticket} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarDemo;
