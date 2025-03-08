// Sample data of companies and job openings
const companies = [
    {
      name: "Tech Innovations Ltd.",
      jobTitle: "Full-stack Developer",
      skills: ["JavaScript", "Node.js", "React", "MongoDB"],
      jobType: "Full-time",
      location: "New York"
    },
    {
      name: "DataAnalytics Co.",
      jobTitle: "Data Scientist",
      skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
      jobType: "Internship",
      location: "San Francisco"
    },
    {
      name: "AI Solutions",
      jobTitle: "AI/ML Engineer",
      skills: ["Python", "TensorFlow", "Machine Learning", "Deep Learning"],
      jobType: "Full-time",
      location: "Remote"
    },
    {
      name: "Web Masters Inc.",
      jobTitle: "Web Developer",
      skills: ["HTML", "CSS", "JavaScript"],
      jobType: "Part-time",
      location: "Austin"
    },
    {
      name: "Cloud Systems",
      jobTitle: "Cloud Architect",
      skills: ["AWS", "Cloud Computing", "Docker", "Kubernetes"],
      jobType: "Full-time",
      location: "Seattle"
    }
  ];
  
  // Function to handle form submission
  document.getElementById("jobRequestForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // Get the user input
    const userSkills = document.getElementById("skills").value.toLowerCase().split(",").map(skill => skill.trim());
    const userJobType = document.getElementById("job-interest").value;
  
    // Filter companies based on job type and skills
    const matchingCompanies = companies.filter(company => {
      const matchesJobType = company.jobType === userJobType || userJobType === "";
      const matchesSkills = company.skills.some(skill => userSkills.includes(skill.toLowerCase()));
  
      return matchesJobType && matchesSkills;
    });
  
    // Display matching companies
    const recommendationsDiv = document.getElementById("companies-list");
    recommendationsDiv.innerHTML = ""; // Clear any previous recommendations
  
    if (matchingCompanies.length > 0) {
      matchingCompanies.forEach(company => {
        const companyElement = document.createElement("div");
        companyElement.classList.add("col");
  
        companyElement.innerHTML = `
          <div class="card h-100">
            <img src="https://via.placeholder.com/350x200" class="card-img-top" alt="${company.name}">
            <div class="card-body">
              <h5 class="card-title">${company.name} - ${company.jobTitle}</h5>
              <p class="card-text">Location: ${company.location}</p>
              <p><strong>Skills Required:</strong> ${company.skills.join(", ")}</p>
              <a href="#" class="btn btn-primary">Apply Now</a>
            </div>
          </div>
        `;
  
        recommendationsDiv.appendChild(companyElement);
      });
    } else {
      recommendationsDiv.innerHTML = "<p class='text-center'>No matching companies found based on your skills and preferences.</p>";
    }
  });
  
  // Display all available companies (irrespective of the user's input)
  function displayAllCompanies() {
    const allCompaniesDiv = document.getElementById("all-companies-list");
    allCompaniesDiv.innerHTML = ""; // Clear any previous list
  
    companies.forEach(company => {
      const companyElement = document.createElement("div");
      companyElement.classList.add("col");
  
      companyElement.innerHTML = `
        <div class="card h-100">
          <img src="https://via.placeholder.com/350x200" class="card-img-top" alt="${company.name}">
          <div class="card-body">
            <h5 class="card-title">${company.name} - ${company.jobTitle}</h5>
            <p class="card-text">Location: ${company.location}</p>
            <p><strong>Skills Required:</strong> ${company.skills.join(", ")}</p>
            <a href="#" class="btn btn-primary">Apply Now</a>
          </div>
        </div>
      `;
  
      allCompaniesDiv.appendChild(companyElement);
    });
  }
  
  // Call function to display all companies when the page loads
  window.onload = displayAllCompanies;
  