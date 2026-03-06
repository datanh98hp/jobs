/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { serializeData } from "@/lib/serializer";
import type { Employee } from "@/generated/prisma";

export interface EmployeeCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // roles?: Role[] | null;
  jobTitle: string;
  address: string;
  avatar: string;
  salary: number;
}

export interface EmployeeUpdate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // roles?: Role[];
  jobTitle: string;
  address: string;
  avatar: string;
  salary: number;
}
export interface EmployeeResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // roles?: Role[] | null;
  jobTitle: string;
  address: string;
  avatar: string;
  salary: number;
}


export interface FilterEmployee {
  page: number;
  pageSize: number;
  search: string; // keyword
  sortBy: 'salary'|'createdAt'| 'updatedAt'
  sortDirection?: "asc" | "desc";
}

export const data_example: EmployeeCreate[] = [
  {
    firstName: "Shakira",
    lastName: "Erdman",
    email: "Geraldine34@gmail.com",
    phone: "1-552-938-7312 x6298",
    jobTitle: "Future Factors Designer",
    address: "5504 Stiedemann Station, Lucianostad, Maryland 41361",
    salary: 5000,
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/68.jpg",
  },
  {
    firstName: "Deontae",
    lastName: "Ferry",
    email: "Art.Schaden@hotmail.com",
    phone: "675.216.8098 x895",
    jobTitle: "Principal Solutions Administrator",
    salary: 6000,
    address: "223 Riverside Avenue, New Lorainemouth, Kansas 52517-7605",
    avatar: "https://avatars.githubusercontent.com/u/2657927",
  },
  {
    firstName: "Rudy",
    lastName: "Steuber",
    email: "Ross.Donnelly@yahoo.com",
    phone: "982-491-2953 x550",
    jobTitle: "Investor Group Manager",
    address: "74344 West End, Fort Gwendolyn, Utah 76841-4683",
    salary: 5500,
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/10.jpg",
  },
  {
    firstName: "Perry",
    lastName: "Keebler",
    email: "Crawford68@hotmail.com",
    phone: "1-686-278-6452 x43612",
    jobTitle: "Human Usability Director",
    address: "237 Kellen Mount, Weberstad, Nevada 21106",
    salary: 5200,
    avatar: "https://avatars.githubusercontent.com/u/38414078",
  },
  {
    firstName: "Assunta",
    lastName: "Langworth",
    email: "Lyla_Beier-Donnelly@yahoo.com",
    phone: "498.704.7304 x0488",
    jobTitle: "Product Brand Planner",
    salary: 4200,
    address: "2202 Thurman Way, East Kim, Alaska 30062-5896",
    avatar: "https://avatars.githubusercontent.com/u/84479048",
  },
  {
    firstName: "Casandra",
    lastName: "Ondricka",
    email: "Keyshawn64@gmail.com",
    phone: "665-637-7357 x73240",
    jobTitle: "Chief Response Engineer",
    salary: 4000,
    address: "82792 Davis Street, Fort Terrance, Connecticut 84075-2078",
    avatar: "https://avatars.githubusercontent.com/u/80332007",
  },
  {
    firstName: "Desiree",
    lastName: "Powlowski",
    email: "Rebeka_Leannon@gmail.com",
    phone: "547.846.0745",
    jobTitle: "Global Group Representative",
    salary: 5100,
    address: "27750 Stiedemann Freeway, Barrowston, Pennsylvania 39105",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/2.jpg",
  },
  {
    firstName: "Lorenz",
    lastName: "Zieme",
    email: "Jamison_Zulauf@gmail.com",
    phone: "610-839-0871 x3475",
    jobTitle: "Lead Intranet Specialist",
    salary: 5400,
    address: "89131 Krajcik Gateway, Bartonworth, Oregon 67619-6367",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/90.jpg",
  },
  {
    firstName: "Houston",
    lastName: "Runte",
    email: "Marian.Abbott11@gmail.com",
    phone: "937.295.6785",
    jobTitle: "Product Interactions Supervisor",
    salary: 3000,
    address: "212 Kayli Forest, East Ella, Hawaii 77287-0532",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/91.jpg",
  },
  {
    firstName: "Gerald",
    lastName: "Predovic",
    email: "Jazmyn_Stanton@yahoo.com",
    phone: "(682) 936-2861",
    jobTitle: "Corporate Web Associate",
    salary: 4000,
    address: "388 Bechtelar Walk, East Neoma, New Mexico 31781-8286",
    avatar: "https://avatars.githubusercontent.com/u/22306535",
  },
  {
    firstName: "Lisandro",
    lastName: "Wilderman",
    email: "Anne57@yahoo.com",
    phone: "958-257-9732",
    jobTitle: "National Division Orchestrator",
    salary: 6000,
    address: "394 Jerod Landing, Metzville, Wisconsin 55576",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/43.jpg",
  },
  {
    //id: "b56d0595-ff31-4971-8b45-efafc752fc09",
    firstName: "Jalen",
    lastName: "Welch",
    email: "Erick_Turner33@yahoo.com",
    phone: "748-725-0618 x6879",
    jobTitle: "Central Quality Executive",
    salary: 5000,
    address: "5345 Allene Trafficway, Isadoreshire, New Jersey 59780",
    avatar: "https://avatars.githubusercontent.com/u/9916837",
  },
  {
    //id: "556ab87e-fe67-428d-85da-24338a27a39e",
    firstName: "Hudson",
    lastName: "Reichel",
    email: "Rupert80@hotmail.com",
    phone: "938.352.5750 x091",
    jobTitle: "Chief Operations Coordinator",
    address: "2375 Lockman Views, Clotildemouth, Mississippi 22836",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/33.jpg",
    salary: 5200,
  },
  {
    //id: "262b28e3-3d52-4ca4-aa56-c82cf674415f",
    firstName: "Jaylon",
    lastName: "Medhurst",
    email: "Rosetta.Boyle@gmail.com",
    phone: "480.706.6310 x044",
    jobTitle: "National Brand Associate",
    address: "49649 Jakubowski Isle, Roweton, Montana 27450",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/19.jpg",
    salary: 5100,
  },
  {
    // id: "fc7fd97a-cdd1-44d8-a4af-4bd44b929eea",
    firstName: "Wendell",
    lastName: "VonRueden",
    email: "Iliana.Howe22@yahoo.com",
    phone: "(973) 666-9076",
    jobTitle: "Global Tactics Strategist",
    address: "61961 Brendan Pines, Bolingbrook, Tennessee 97519-9515",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/20.jpg",
    salary: 5251,
  },
  {
    //id: "a8af4a2e-7893-4726-b797-f477da7ebaef",
    firstName: "Nikko",
    lastName: "Kautzer",
    email: "Robyn.Raynor53@yahoo.com",
    phone: "(848) 990-0798",
    jobTitle: "Principal Assurance Consultant",
    address: "6044 Janae Alley, Providence, Arizona 95017",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/83.jpg",
    salary: 4520,
  },
  {
    // id: "3dc4e669-14aa-47b7-9342-80f4cdc34cf9",
    firstName: "Kathryn",
    lastName: "Bins",
    email: "Jarod5@yahoo.com",
    phone: "(695) 981-0182 x430",
    jobTitle: "District Solutions Architect",
    address: "45998 Kovacek Islands, West Darwin, Maine 68583-9491",
    avatar: "https://avatars.githubusercontent.com/u/90524671",
    salary: 5422,
  },
  {
    // id: "ea06896a-2a45-49e0-b9be-d0d31e742e6a",
    firstName: "Katrine",
    lastName: "Batz",
    email: "Greyson_Stokes23@gmail.com",
    phone: "366-512-5451",
    jobTitle: "Senior Applications Liaison",
    address: "725 Lindgren Wells, Melanyborough, South Dakota 63415-4798",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/40.jpg",
    salary: 4700,
  },
  {
    // id: "cd805791-ce33-43c1-bb45-98b4736a538a",
    firstName: "Kay",
    lastName: "Doyle",
    email: "Garnett6@hotmail.com",
    phone: "384-989-0010 x1738",
    jobTitle: "Chief Quality Associate",
    address: "274 Buckingham Road, Des Moines, Kansas 53098",
    avatar: "https://avatars.githubusercontent.com/u/7292850",
    salary: 4630,
  },
  {
    firstName: "Rhea",
    lastName: "Mohr",
    email: "Saige5@gmail.com",
    phone: "1-395-840-9580 x49115",
    jobTitle: "International Tactics Technician",
    address: "5494 6th Avenue, Antoniacester, Tennessee 70060-1234",
    avatar: "https://avatars.githubusercontent.com/u/41097341",
    salary: 3680,
  },
];

const getList = async (filter: FilterEmployee) => {
  const { page = 1, pageSize = 10, search, sortBy, sortDirection } = filter;
 //s console.log("--log filter", filter);
  try {
    // setTimeout(() => {}, 3000);
    const list = await prisma.employee.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortDirection,
      },
      where: {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
          { jobTitle: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      },
    });
    const total = await prisma.employee.count();
    const totalPage = Math.ceil(total / pageSize);
    const data = { list: serializeData(list), total, totalPage, page, pageSize };
    //console.log("res pagination:", data);
    // console.log("--log employee", employees);
    return data;
  } catch (error) {
    return {
      error: "Get list failed" + error,
    };
  }
};
const createOne = async (data: EmployeeCreate) => {
  const res = await prisma.employee.create({
    data,
  });

  return serializeData(res);
};
const getById = async (id: string) => {
  const res = await prisma.employee.findUnique({
    where: {
      id: id,
    },
  });
  if (!res) {
    return {
      error: "Not found",
    };
  }
  return serializeData(res);
};

const updateById = async (id: string, data: EmployeeUpdate) => {
  //update user by id
  try {
    const res = await prisma.employee.update({
      where: {
        id: id,
      },
      data: data,
    });

    return serializeData(res);
  } catch (error) {
    return error;
  }
};
const deleteById = async (id: string) => {
  //del user by id
  return await prisma.employee
    .delete({
      where: {
        id: id,
      },
    })
    .then((data: Employee) => {
      return data;
    })
    .catch((error: any) => {
      return error;
    });
};

const deleteByList = async (ids: string[]) => {
  return await prisma.employee
    .deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
    .then((data: { count: number }) => {
      return data;
    })
    .catch((error: any) => {
      return error;
    });
};

const seeds = async () => {
  try {
    await prisma.employee.createMany({ data: data_example });
    return {
      ok: true,
      message: "Seeds has been created !",
    };
  } catch (error) {
    return error;
  }
};

const employee = {
  getList,
  createOne,
  getById,
  updateById,
  deleteById,
  deleteByList,
  seeds,
};

export default employee;
