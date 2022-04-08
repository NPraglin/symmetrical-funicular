import React from "react";
import { Title, Text, Paper, Button } from '@mantine/core';

// TODO re-wire users to a browse by user

const Home = () => {
  return (
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
      <Paper shadow="xl" p="lg" style={{maxWidth: 1000}} align="center" >
        <Title order={1}>Welcome to WorkByte!</Title>
        <br />
        <Text>This project is still in the works and has big aspirations!</Text>
        <Text>
          If you're a digital nomad, you may often be looking for places to get some work done. We're here to help. WorkByte is a completely free web-app to find, review, rate, and share work spaces! Perhaps your office is your local starbucks, or perhaps it's a WeWork location, either way post about it here!
        </Text>
      </Paper>
    </div>
  );
};

export default Home;