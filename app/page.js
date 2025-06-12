
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'; // Corrected import
import { ChevronRight, Layout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar, BarChart2, Workflow  } from 'lucide-react';
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import CompanyCarousel from '@/components/CompanyCarousel'

const features = [
  {
    title: 'Intuitive Jira Board',
    description: 'Experience a user-friendly interface that simplifies project management.',
    icon:Layout,
  },
  {
    title: 'Real-time Collaboration', 
    description: 'Collaborate with your team in real-time, ensuring everyone is on the same page.',
    icon:Calendar,
  },
  {
    title: 'Comprehensive Reporting',
    description: 'Gain insights into your projects with detailed reports and analytics.',
    icon:BarChart2,
  },
  {
    title: 'Customizable Workflows',  
    description: 'Tailor your workflows to fit your team\'s unique processes and requirements.',
    icon:Workflow ,
  },
];

export const Home = () => {
  return (
    <div className='min-h-screen'>
         {/*Hero section*/}

      <section className='container mx-auto px-5 py-20 flex flex-col items-center justify-center text-center space-y-6'>
        <h1 className='text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col'>

     Streamline Your Workflow <br />
          <span className='flex mx-auto gap-3 sm:gap-4 items-center'>
            with{ " "}
            <Image
              src="/logo1.png"
              alt="Jirasoft Logo"
              width={200}
              height={50}
              className='h-14 sm:h-24 w-auto object-contain'/>
          </span>
        </h1>
        <p className='text-xl text-gray-300 mb-10 max-w-3xl mx-auto'> Empower your team with our intuitive project manaagement solution</p>
    <div className="flex flex-row gap-4">
          <Link href="/onboarding">
            <Button size="lg">
              Get Started <ChevronRight size={18} />
            </Button>
          </Link>

          <Link href="#features">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div> 
      </section>

<section id="features" className='bg-gray-900 py-20 px-5'>
<div className='container mx-auto'>
  <h3 className='text-3xl font-bold mb-12 text-center'>Key Features</h3>
  <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
    {features.map((feature, index) => {
      return (
        <Card key={index}>

  <CardContent>
   <feature.icon className='h-10 w-10 mb-4 text-blue-300' />
  <h4 className='text-xl font-semibold mb-2'>{feature.title}</h4>
  <p className='text-gray-400'>{feature.description}</p>
  </CardContent>
  
</Card>
      );
    })}
  </div>
</div>

  </section>


{/*Trusted partners*/}
<section className=' py-20 '>
<div className='container mx-auto'>
  <h3 className='text-3xl font-bold mb-12 text-center'>Our Partners</h3>
 <CompanyCarousel>
  
 </CompanyCarousel>
</div>

  </section>
      
    </div>
  )
}
export default Home